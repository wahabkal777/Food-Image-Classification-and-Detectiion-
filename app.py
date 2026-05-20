import os
import io
import json
import base64
import uuid
import numpy as np
import cv2
import json
from PIL import Image
from datetime import datetime


from flask import (
    Flask, render_template, request, redirect, url_for,
    flash, session, jsonify
)
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash

# ------------------------
# -------------------------
# Optional YOLO
# -------------------------
try:
    from ultralytics import YOLO
    YOLO_AVAILABLE = True
except Exception:
    YOLO = None
    YOLO_AVAILABLE = False

# -------------------------
# Flask setup
# -------------------------
app = Flask(__name__)
app.secret_key = "super-secret-key"

basedir = os.path.abspath(os.path.dirname(__file__))
db_folder = os.path.join(basedir, "instance")
os.makedirs(db_folder, exist_ok=True)

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///" + os.path.join(db_folder, "database.db")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db = SQLAlchemy(app)

UPLOAD_FOLDER = os.path.join(basedir, "uploads")
RESULT_FOLDER = os.path.join(basedir, "static", "results")
MODEL_FOLDER = os.path.join(basedir, "models")
CONFIG_FOLDER = os.path.join(basedir, "config")

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(RESULT_FOLDER, exist_ok=True)
os.makedirs(MODEL_FOLDER, exist_ok=True)
os.makedirs(CONFIG_FOLDER, exist_ok=True)








        
# -------------------------
# Database models
# -------------------------
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())

class Contact(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(150))
    email = db.Column(db.String(150))
    message = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())

class ClassificationResult(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    predicted_class = db.Column(db.String(100))
    confidence = db.Column(db.Float)
    timestamp = db.Column(db.DateTime, default=db.func.current_timestamp())

with app.app_context():
    db.create_all()

    # Ensure admin exists
    admin_email = "admin@gmail.com"
    admin_user = User.query.filter_by(email=admin_email).first()
    if not admin_user:
        admin_user = User(
            username="admin",
            email=admin_email,
            password=generate_password_hash("admin123")
        )
        db.session.add(admin_user)
        db.session.commit()

# -------------------------
# Load classification model
# -------------------------
from transformers import pipeline

# -------------------------
# Load HuggingFace Food Model
# -------------------------
classification_model = None

try:
    classification_model = pipeline(
        "image-classification",
        model="Kaludi/food-category-classification-v2.0"
    )

    print("✅ HuggingFace food model loaded")

except Exception as e:
    print("❌ Model load error:", e)
# -------------------------
# -------------------------
# Load detection model (FIXED)
# -------------------------
detection_model = None

try:
    from ultralytics import YOLO
    detection_model = YOLO("yolov8n.pt")  # auto-downloads model
    print("✅ YOLOv8 model loaded successfully")
except Exception as e:
    detection_model = None
    print("❌ YOLO load error:", e)

# -------------------------
# Helpers
# -------------------------
def current_user_data():
    data = {}
    if session.get("user_id"):
        user = User.query.get(session["user_id"])
        if user:
            data["username"] = user.username
            data["total_classifications"] = ClassificationResult.query.filter_by(user_id=session["user_id"]).count()
            data["total_detections"] = session.get("total_detections", 0)
    return data

def get_food_info(class_name):
    return food_data.get(class_name, {
        "restaurants": [],
        "blogs": []
    })


FOOD_DATA_PATH = os.path.join(basedir, "food_data.json")

with open(FOOD_DATA_PATH, "r", encoding="utf-8") as f:
    food_data = json.load(f)
# -------------------------
# Routes
# -------------------------
@app.route("/")
def home():
    return redirect(url_for("signup"))

@app.route("/index")
def index():
    return render_template("index.html", **current_user_data())

@app.route("/signup", methods=["GET", "POST"])
def signup():
    if request.method == "POST":
        username = request.form.get("username", "").strip()
        email = request.form.get("email", "").strip()
        password = request.form.get("password", "")

        if not username or not email or not password:
            flash("All fields are required!", "danger")
            return redirect(url_for("signup"))

        if User.query.filter_by(username=username).first():
            flash("Username already exists!", "danger")
            return redirect(url_for("signup"))
        if User.query.filter_by(email=email).first():
            flash("Email already registered!", "danger")
            return redirect(url_for("signup"))

        new_user = User(
            username=username,
            email=email,
            password=generate_password_hash(password)
        )
        db.session.add(new_user)
        db.session.commit()
        flash("Account created successfully!", "success")
        return redirect(url_for("login"))

    return render_template("signup.html")

@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        email = request.form.get("email", "").strip()
        password = request.form.get("password", "")

        user = User.query.filter_by(email=email).first()
        if user and check_password_hash(user.password, password):
            session["user_id"] = user.id
            session["username"] = user.username
            session["is_admin"] = (email == "admin@gmail.com")
            session.setdefault("total_detections", 0)

            if session["is_admin"]:
                return redirect(url_for("admin_dashboard"))
            return redirect(url_for("index"))

        flash("Invalid email or password", "danger")

    return render_template("login.html")

@app.route("/logout")
def logout():
    session.clear()
    return redirect(url_for("signup"))

@app.route("/admin")
def admin_dashboard():
    if not session.get("is_admin"):
        flash("Admin login required", "danger")
        return redirect(url_for("login"))

    users = User.query.order_by(User.created_at.desc()).all()
    messages = Contact.query.order_by(Contact.created_at.desc()).all()
    total_users = User.query.count()
    total_messages = Contact.query.count()

    return render_template(
        "admin_dashboard.html",
        users=users,
        messages=messages,
        total_users=total_users,
        total_messages=total_messages
    )

@app.route("/admin/delete_user/<int:user_id>", methods=["POST"])
def delete_user(user_id):
    if not session.get("is_admin"):
        flash("Admin login required", "danger")
        return redirect(url_for("login"))

    user = User.query.get_or_404(user_id)
    if user.email == "admin@gmail.com":
        flash("Cannot delete admin account.", "danger")
    else:
        db.session.delete(user)
        db.session.commit()
        flash("User deleted successfully.", "success")
    return redirect(url_for("admin_dashboard"))

@app.route("/admin/delete_message/<int:message_id>", methods=["POST"])
def delete_message(message_id):
    if not session.get("is_admin"):
        flash("Admin login required", "danger")
        return redirect(url_for("login"))

    contact = Contact.query.get_or_404(message_id)
    db.session.delete(contact)
    db.session.commit()
    flash("Message deleted successfully.", "success")
    return redirect(url_for("admin_dashboard"))

@app.route("/admin/clear_messages", methods=["POST"])
def clear_messages():
    if not session.get("is_admin"):
        flash("Admin login required", "danger")
        return redirect(url_for("login"))

    Contact.query.delete()
    db.session.commit()
    flash("All messages cleared.", "success")
    return redirect(url_for("admin_dashboard"))

@app.route("/classification", methods=["GET", "POST"])
def classification():
    if request.method == "POST":
        try:
            if "image" not in request.files:
                return jsonify({"error": "No image uploaded"}), 400

            file = request.files["image"]
            if file.filename == "":
                return jsonify({"error": "Empty filename"}), 400

            image_data = file.read()
            image = Image.open(io.BytesIO(image_data)).convert("RGB")
            resized = image.resize((224, 224))

            # CHECK MODEL
            if classification_model is None:
                return jsonify({"error": "Model not loaded"}), 500

            # PREDICTION
            results = classification_model(resized)
            best = results[0]

            predicted_class = best['label']
            confidence = float(best['score']) * 100

            img_base64 = base64.b64encode(image_data).decode("utf-8")

            # SAVE DB
            if session.get("user_id"):
                result = ClassificationResult(
                    user_id=session["user_id"],
                    predicted_class=predicted_class,
                    confidence=confidence
                )
                db.session.add(result)
                db.session.commit()

            extra_data = get_food_info(predicted_class)

            return jsonify({
    "success": True,
    "predicted_class": predicted_class,
    "confidence": f"{confidence:.2f}%",
    "image": f"data:image/jpeg;base64,{img_base64}",

    "restaurants": extra_data.get("restaurants", []),
    "blogs": extra_data.get("blogs", []),
    "description": extra_data.get("description", "")
})

        except Exception as e:
            return jsonify({"error": str(e)}), 500

    return render_template("classification.html", **current_user_data())

@app.route("/classes")
def show_classes():
    data = current_user_data()
    classes = []
    if not classes:
        flash("No classification classes are currently available.", "warning")
    return render_template("classes.html", classes=classes, class_count=len(classes), **data)



@app.route("/detection")
def detection():
    return render_template("detection.html", **current_user_data())

@app.route("/detect", methods=["POST"])
def detect():
    if "image" not in request.files:
        return jsonify({"error": "No image uploaded"}), 400

    if detection_model is None:
        return jsonify({"error": "Detection model not available on this system"}), 500

    file = request.files["image"]
    if file.filename == "":
        return jsonify({"error": "Empty filename"}), 400

    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in [".jpg", ".jpeg", ".png", ".webp"]:
        ext = ".jpg"

    input_name = f"{uuid.uuid4().hex}{ext}"
    input_path = os.path.join(UPLOAD_FOLDER, input_name)
    file.save(input_path)

    try:
        results = detection_model(input_path)
        annotated_img = results[0].plot()

        result_name = f"result_{uuid.uuid4().hex}.jpg"
        result_path = os.path.join(RESULT_FOLDER, result_name)
        cv2.imwrite(result_path, annotated_img)

        detections = []
        if results[0].boxes is not None:
            names = results[0].names
            for box in results[0].boxes:
                cls_id = int(box.cls[0])
                conf = float(box.conf[0])
                detections.append({
                    "label": names.get(cls_id, str(cls_id)),
                    "confidence": round(conf * 100, 2)
                })

        if session.get("user_id"):
            session["total_detections"] = session.get("total_detections", 0) + 1

        return jsonify({
            "success": True,
            "result_image": url_for("static", filename=f"results/{result_name}"),
            "detections": detections
        })

    except Exception as e:
        return jsonify({"error": f"Detection error: {str(e)}"}), 500

@app.route("/contact", methods=["GET", "POST"])
def contact():
    if request.method == "POST":
        name = request.form.get("name", "").strip()
        email = request.form.get("email", "").strip()
        message = request.form.get("message", "").strip()

        if not name or not email or not message:
            flash("Please fill all fields.", "danger")
            return redirect(url_for("contact"))

        new_msg = Contact(name=name, email=email, message=message)
        db.session.add(new_msg)
        db.session.commit()
        flash("Message sent successfully!", "success")
        return redirect(url_for("contact"))

    return render_template("contact.html", **current_user_data())





@app.errorhandler(500)
def error(e):
    return render_template("500.html"), 500

if __name__ == "__main__":
    app.run(debug=True)

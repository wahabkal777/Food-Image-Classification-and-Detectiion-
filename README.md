# 🍔 Food Classification & Object Detection System (FYP)

## 📖 Project Overview
This is a Final Year Project built using Flask that performs **food image classification** and **object detection** using deep learning models. The system allows users to upload images and get real-time predictions along with detected objects and confidence scores.

The project also includes user authentication, admin dashboard, and contact management system.

---

## 🚀 Features
- 👤 User Registration & Login System  
- 🔐 Admin Dashboard  
- 🍔 Food Image Classification  
- 📦 Object Detection using YOLOv8  
- 📊 Confidence Score Display  
- 🖼️ Image Upload & Result Visualization  
- 💬 Contact Form System  
- 📁 Result History Storage  

---

## 🧠 Machine Learning Models Used

### 🍔 Food Classification Model
- Model: Kaludi/food-category-classification-v2.0  
- Source: Hugging Face Transformers  
- Type: Image Classification (Swin-based model)

### 📦 Object Detection Model
- Model: YOLOv8 (Ultralytics)
- Used for detecting objects in uploaded images

---

## ⚙️ Tech Stack

- Python 🐍  
- Flask 🌐  
- SQLAlchemy 🗄️  
- OpenCV 📷  
- PyTorch 🔥  
- Hugging Face Transformers 🤗  
- YOLOv8 (Ultralytics)  

---

## 📂 Project Structure
FYP-Project/
│
├── app.py
├── templates/
│ ├── index.html
│ ├── login.html
│ ├── signup.html
│ ├── classification.html
│ ├── detection.html
│ ├── contact.html
│ ├── admin_dashboard.html
  
│
├── static/
│ ├── css/
│ ├── js/
│ └── results/
│
├── models/
├── uploads/
├── instance/
├── requirements.txt
└── README.md


---

## ▶️ How to Run Project

### 1️⃣ Install dependencies
```bash
pip install -r requirements.txt
python app.py
http://127.0.0.1:5000/



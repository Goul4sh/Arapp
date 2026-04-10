# Arapp
### An Arabic language learning platform with exercises, flashcards, and content management.


## 📖 About the Project

Arapp is a web-based language learning platform focused on Arabic.

The platform supports two types of users: learners and administrators; each with their own dedicated views and capabilities. Learners work through exercises and randomly-generated vocabulary drills. Administrators manage the platform's content, they are responsible for every lesson, exercise and word group learners can access.
To handle the unique linguistic complexity of Arabic, the platform integrates the **CAMeL Tools** library for standardised morphological processing. It uses a dedicated **Python service** that analyses each word morphologically before any new content is added to the database.


## ✨ Key Features

**For learners:**
- **Learning course**: Simple lessons and exercises for practising language skills. It includes exercises created specifically for Arabic language's unique nature. 
- **Knowledge compendium**: Lessons are complemented by theory segments, which after completion are stored in the Knowledge Compendium. It allows for quick access to educational material, eliminating the need for completing lessons once again.
- **Personal flashcards**: Flashcards are based on words encountered in lessons. It is possible to divide flashcards into separate groups and revise them individually.
- **Accounts**: Users need to register and log in with email-based authentication. Password recovery is available via email.

**For administrators:**
- **Content management panel**: Complete control of all content available to the learners. Creating, editing and deleting of lessons, exercises, compendium entries and more.
- **Integrated word management**: Words existing in the database can be referenced when creating new lessons and tasks, providing learners with a more dynamic experience.
- **Content analysis on upload**: A dedicated system that queries the database for existing entries that are morphologically close to the new word, marking any possible duplicates that arise from Arabic's root-based word structure. CAMeL Tools handles the analysis for more consistent and standardised content formatting.


## 🛠️ Tech Stack

The project is built in a three-tier architecture (React frontend, Spring and Python backend, PostgreSQL data layer). It also utilises Redis as a cache in order to reduce latency and improve overall user experience.

**Frontend**

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB) ![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)

**Backend**

![Java](https://img.shields.io/badge/java-%23ED8B00.svg?style=for-the-badge&logo=openjdk&logoColor=white) ![Spring](https://img.shields.io/badge/spring-%236DB33F.svg?style=for-the-badge&logo=spring&logoColor=white) ![Python](https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54)

**Databases**

![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white) ![Redis](https://img.shields.io/badge/redis-%23DD0031.svg?style=for-the-badge&logo=redis&logoColor=white)


## 📸 Showcase

This section contains example photos of some existing features and views available in the app.
  
### Learner View

  
Lesson course available to the learners.
  
<img width="600" alt="obraz" src="https://github.com/user-attachments/assets/80d42596-6271-4902-a343-4ee082f2be55" />

  ---
  
In-exercise photo showing a hover pop-up, which allows users to add selected word to their flashcard collection.
  
<img width="400" alt="obraz" src="https://github.com/user-attachments/assets/2af60ab8-ed13-423f-990d-cfa7f474d92f" />
   
   ---
   
View of available word groups and words encountered in recently completed lessons.
  
<img width="600" alt="obraz" src="https://github.com/user-attachments/assets/df1dff57-cc29-4230-b78e-cc3b00e2583e" />
      
   ---
    
### Admin Panel

  
Exercises management panel, showing existing tasks in a lesson.
  
<img width="600"  alt="obraz" src="https://github.com/user-attachments/assets/0da9d0de-0203-4570-b9d2-18ff312d7d57" />

 ---
  
Analysis result view, presenting the words statuses in the database and morphological analysis results.
  
<img width="600"  alt="obraz" src="https://github.com/user-attachments/assets/38bd3761-bcf0-4e66-820d-29f8e7953007" />
  


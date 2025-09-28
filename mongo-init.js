// MongoDB initialization script
db = db.getSiblingDB('codesensei');

// Create collections with indexes
db.createCollection('users');
db.createCollection('questions');
db.createCollection('sessions');
db.createCollection('interests');
db.createCollection('analytics');
db.createCollection('saved_questions');
db.createCollection('solved_questions');
db.createCollection('generated_answers');

// Create indexes for performance
db.users.createIndex({ "username": 1 }, { unique: true });
db.users.createIndex({ "email": 1 }, { unique: true });
db.users.createIndex({ "profile.level": 1 });
db.users.createIndex({ "progress.lastActive": 1 });
db.users.createIndex({ "progress.solvedQuestions": -1 });
db.users.createIndex({ "progress.streak": -1 });

db.questions.createIndex({ "qid": 1 }, { unique: true });
db.questions.createIndex({ "difficulty": 1 });
db.questions.createIndex({ "topics": 1 });
db.questions.createIndex({ "createdAt": 1 });
db.questions.createIndex({ "expiresAt": 1 }, { expireAfterSeconds: 0 });

db.sessions.createIndex({ "userId": 1 });
db.sessions.createIndex({ "questionId": 1 });
db.sessions.createIndex({ "startTime": 1 });

db.interests.createIndex({ "topic": 1 }, { unique: true });
db.interests.createIndex({ "freq": -1 });

db.analytics.createIndex({ "userId": 1 });
db.analytics.createIndex({ "timestamp": 1 });
db.analytics.createIndex({ "type": 1 });

db.saved_questions.createIndex({ "userId": 1 });
db.saved_questions.createIndex({ "questionId": 1 });
db.saved_questions.createIndex({ "savedAt": -1 });
db.saved_questions.createIndex({ "userId": 1, "questionId": 1 }, { unique: true });

db.solved_questions.createIndex({ "userId": 1 });
db.solved_questions.createIndex({ "questionId": 1 });
db.solved_questions.createIndex({ "solvedAt": -1 });
db.solved_questions.createIndex({ "userId": 1, "questionId": 1 }, { unique: true });

db.generated_answers.createIndex({ "questionId": 1 });
db.generated_answers.createIndex({ "language": 1 });
db.generated_answers.createIndex({ "userId": 1 });
db.generated_answers.createIndex({ "generatedAt": -1 });
db.generated_answers.createIndex({ "questionId": 1, "language": 1, "userId": 1 }, { unique: true });

print('Database initialized successfully!');

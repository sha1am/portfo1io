pipeline {
    agent any

    stages {
        stage('Build frontend') {
            steps {
                dir('frontend') {
                    sh 'npm install'
                    sh 'npm run build'
                }
            }
        }

        stage('Build backend') {
            steps {
                dir('drf_backend') {
                    sh 'pip install -r requirements.txt'
                    sh 'python manage.py migrate'
                }
            }
        }

        stage('Test') {
            steps {
                echo 'No tests configured'
            }
        }

        stage('Deploy') {
            steps {
                echo 'Deploying frontend to Netlify and backend to Render...'
                // Deployment commands would go here
            }
        }
    }
}

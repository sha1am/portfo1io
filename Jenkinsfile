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
                dir('backend') {
                    sh 'go test ./...'
                    sh 'go build ./...'
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
                echo 'Deploying frontend to Vercel and backend to Render...'
                // Deployment commands would go here
            }
        }
    }
}

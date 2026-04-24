pipeline {
    agent any

    stages {
        stage('Install frontend dependencies') {
            steps {
                dir('frontend') {
                    sh 'npm ci'
                }
            }
        }

        stage('Build frontend') {
            steps {
                dir('frontend') {
                    sh 'npm run build'
                }
            }
        }

        stage('Test backend') {
            steps {
                dir('backend') {
                    sh 'go test ./...'
                }
            }
        }

        stage('Build backend') {
            steps {
                dir('backend') {
                    sh 'go build ./...'
                }
            }
        }

        stage('Deploy') {
            steps {
                echo 'Deploy frontend to Vercel and backend to Render from validated artifacts.'
                // Deployment commands would go here
            }
        }
    }
}

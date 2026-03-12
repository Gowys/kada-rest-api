pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', 
                    url: 'https://github.com/Gowys/kada-rest-api.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Test') {
            steps {
                sh 'npm test'   // jika ada test script, kalau tidak bisa di-skip
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    docker.build('kada-rest-api')
                }
            }
        }
    }

    post {
        success {
            echo 'Pipeline sukses!'
        }
        failure {
            echo 'Pipeline gagal!'
        }
    }
}
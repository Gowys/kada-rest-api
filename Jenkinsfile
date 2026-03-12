// pipeline {
//     agent any

//     stages {
//         stage('Checkout') {
//             steps {
//                 git branch: 'main', 
//                     url: 'https://github.com/Gowys/kada-rest-api.git'
//             }
//         }

//         stage('Install Dependencies') {
//             steps {
//                 sh 'npm install'
//             }
//         }

//         stage('Test') {
//             steps {
//                 sh 'npm test'   // jika ada test script, kalau tidak bisa di-skip
//             }
//         }

//         stage('Build Docker Image') {
//             steps {
//                 script {
//                     docker.build('kada-rest-api')
//                 }
//             }
//         }
//     }

//     post {
//         success {
//             echo 'Pipeline sukses!'
//         }
//         failure {
//             echo 'Pipeline gagal!'
//         }
//     }
// }

pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                // Mengambil kode terbaru dari GitHub
                checkout scm
            }
        }

        stage('Build & Deploy with Docker Compose') {
            steps {
                // Mengambil file .env dari Jenkins Credentials dan men-deploy dengan Docker
                withCredentials([file(credentialsId: 'kada-jenkins', variable: 'SECRET_ENV')]) {
                    sh 'cp $SECRET_ENV .env'

                    // 1. Bersihkan paksa container lama jika masih nyangkut
                    // sh 'docker rm -f mongodb || true'
                    sh 'docker stop kada-rest-api || true'
                    sh 'docker rm -f kada-rest-api || true'
                    
                    // Mematikan kontainer lama lalu build & run kontainer baru
                    // sh 'docker compose down'              // Ganti sama script yang kemarin
                    // sh 'docker compose up --build -d'     

                    // sh 'docker ps'
                    sh 'docker build -t kada-rest-api .'
                    sh 'docker run -d --name kada-rest-api -p 5000:3000 kada-rest-api .'
                }
            }
        }
    }

    post {
        success {
            echo 'Pipeline berhasil! REST API sudah berjalan.'
        }
        failure {
            echo 'Pipeline gagal. Silakan cek log Jenkins.'
        }
        always {
            // Menghapus file .env untuk keamanan
            sh 'rm -f .env'
        }
    }
}
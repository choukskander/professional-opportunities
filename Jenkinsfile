// pipeline{
// agent any

// environment {
// registryCredentials = "nexus"
// registry = "192.168.1.8:8081"
// }

// stages {
// stage('Install dependencies') {
// steps{
// script {
// sh('npm install')
// }
// }
// }
// stage('Unit Test') {
// steps{
// script {
// sh('npm -v')
// }
// }
// }
// stage('SonarQube Analysis') {
// steps{
// script { 
// def scannerHome = tool 'scanner'
// withSonarQubeEnv {
// sh "${scannerHome}/bin/sonar-scanner"
// }
// } 
// } 
// }

// stage('Build application') {
// steps{
// script {
// sh('npm install terser')
// sh('npm run build-dev')
// }
// }
// }
// stage('Building images (node and mongo)') {
// steps{
// script {
// sh('docker-compose build')
// }
// }
// }



// stage('Deploy to Nexus') {
//     steps { 
//         script {
//            /* docker.withRegistry("http://${registry}", "${registryCredentials}") {
//                 sh("docker push ${registry}/nodemongoapp:5.0")
//             }*/
//             echo 'docker push ${registry}/nodemongoapp:5.0'
//         }
//     }
// }

// stage('Run application ') {
//     steps{ 
//         script {
//            /* docker.withRegistry("http://${registry}", "${registryCredentials}") {
//                 sh("docker pull ${registry}/nodemongoapp:6.0")
//                 sh("docker-compose up -d")
//             }*/
//             echo 'docker-compose up -d'
//         }
//     }
// }


// stage('Grafana') {
//     steps {
//           script {
                    
//                         echo 'Checking Grafana health...'
//                         sh 'pwd'
                        
                    
//                 }
  
//     }
// }

// }
// }
pipeline {
    agent any

    stages {
        stage('Install Dependencies') {
            steps {
                script {
                    // Install the project's dependencies
                    sh 'npm install'
                }
            }
        }
        stage('Build') {
            steps {
                script {
                    // Build the project (if there's a build step)
                    sh 'npm run build'
                }
            }
        }
        stage('Test') {
            steps {
                script {
                    // Run tests
                    sh 'npm test'
                }
            }
        }
        stage('Deploy') {
            steps {
                script {
                    // Deployment steps (e.g., Docker, SSH, etc.)
                    echo 'Deploying the application...'
                }
            }
        }
    }
}

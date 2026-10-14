pipeline {
  agent any

  environment {
    IMAGE_NAME = 'devsecops-app'
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Test') {
      steps {
        sh '''
          docker build --target test -t ${IMAGE_NAME}-test:${BUILD_NUMBER} -f Dockerfile.test .
          docker run --rm ${IMAGE_NAME}-test:${BUILD_NUMBER}
        '''
      }
    }

    stage('Docker Build') {
      steps {
        sh 'docker build -t ${IMAGE_NAME}:${BUILD_NUMBER} .'
      }
    }

    stage('Trivy FS Scan') {
      steps {
        sh '''
          docker create --name trivy-fs-${BUILD_NUMBER} -v trivy_cache:/root/.cache/ --entrypoint sleep aquasec/trivy:latest 600
          docker start trivy-fs-${BUILD_NUMBER}
          docker cp "$WORKSPACE" trivy-fs-${BUILD_NUMBER}:/src
          docker exec trivy-fs-${BUILD_NUMBER} trivy fs --severity HIGH,CRITICAL --exit-code 0 /src
          docker rm -f trivy-fs-${BUILD_NUMBER}
        '''
      }
    }

    stage('Trivy Image Scan') {
      steps {
        sh '''
          docker run --rm \
            -v trivy_cache:/root/.cache/ \
            -v /var/run/docker.sock:/var/run/docker.sock \
            aquasec/trivy:latest image --severity HIGH,CRITICAL --exit-code 0 ${IMAGE_NAME}:${BUILD_NUMBER}
        '''
      }
    }
  }

  post {
    success { echo "Build ${BUILD_NUMBER} OK" }
    failure { echo "Build ${BUILD_NUMBER} KO" }
  }
}
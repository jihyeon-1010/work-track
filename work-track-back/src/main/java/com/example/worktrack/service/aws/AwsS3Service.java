package com.example.worktrack.service.aws;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.*;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Base64;
import java.util.List;

@RequiredArgsConstructor
@Service
public class AwsS3Service {

    private final AmazonS3 amazonS3;

    @Value("${cloud.aws.s3.bucket}")
    private String bucketName;

    // 프로필 사진 업로드
    @Transactional
    public String uploadProfileImage(String email, String base64Data) {
        // 파일 이름
        String fileName = "profile.png";

        // S3에 저장될 이미지 경로 설정
        String key = "profile/" + email + "/" + fileName;

        try {
            // 해당 경로에 이미지가 존재하면 삭제
            if (amazonS3.doesObjectExist(bucketName, key)) {
                amazonS3.deleteObject(bucketName, key);
            }

            // Base64 데이터를 바이트 배열로 디코딩
            byte[] imageData = Base64.getDecoder().decode(base64Data);

            // 바이트 배열을 ByteArrayInputStream으로 변환
            ByteArrayInputStream inputStream = new ByteArrayInputStream(imageData);

            // S3에 이미지 업로드
            amazonS3.putObject(new PutObjectRequest(bucketName, key, inputStream, null));

            // 업로드한 이미지의 URL 반환
            return amazonS3.getUrl(bucketName, key).toString();
        } catch (AmazonS3Exception e) {
            // S3 업로드 실패 시 예외 처리
            throw new RuntimeException("S3 업로드 실패", e);
        } catch (IllegalArgumentException e) {
            // 잘못된 base64 데이터인 경우 예외 처리
            throw new IllegalArgumentException("잘못된 base64 데이터", e);
        }
    }

    // 메신저 이미지 업로드
    public String uploadImage(String channelId, String employeeId, MultipartFile file) {
        String baseFileName = "image";
        String fileExtension = ".png";
        String directoryPath = channelId + "/" + employeeId + "/";

        // 파일 이름에 타임스탬프 추가
        long timestamp = System.currentTimeMillis();
        String fileName = "image_" + timestamp + ".png";
        String key = channelId + "/" + employeeId + "/" + fileName;

        try {
            // MultipartFile을 InputStream으로 변환하여 S3에 업로드
            InputStream inputStream = file.getInputStream();
            ObjectMetadata metadata = new ObjectMetadata();
            metadata.setContentType(file.getContentType());
            metadata.setContentLength(file.getSize());
            amazonS3.putObject(new PutObjectRequest(bucketName, key, inputStream, metadata));

            // 업로드한 이미지의 URL을 반환
            return amazonS3.getUrl(bucketName, key).toString();
        } catch (IOException e) {
            throw new RuntimeException("이미지 업로드 실패", e);
        }
    }

}

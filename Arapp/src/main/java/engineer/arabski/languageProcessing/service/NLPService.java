package engineer.arabski.languageProcessing.service;

import engineer.arabski.languageProcessing.dto.LemmaResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.List;

@Service
public class NLPService {

    private final RestClient restClient;


    public NLPService(@Value("${python.service.url}") String pythonServiceUrl, RestClient.Builder restClientBuilder) {
        this.restClient = restClientBuilder
                .baseUrl(pythonServiceUrl)
                .build();
    }

    public List<LemmaResponse> analyzeText(String text) {
        record Request(String text) {
        }

        return restClient.post()
                .uri("/analyze-text")
                .contentType(MediaType.APPLICATION_JSON)
                .body(new Request(text))
                .retrieve()
                .body(new ParameterizedTypeReference<List<LemmaResponse>>() {});
    }

}


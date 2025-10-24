package engineer.arabski;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.context.WebServerInitializedEvent;
import org.springframework.context.ApplicationListener;

@SpringBootApplication
public class ArappApplication implements ApplicationListener<WebServerInitializedEvent> {

    public static void main(String[] args) {
        SpringApplication.run(ArappApplication.class, args);
    }

    @Override
    public void onApplicationEvent(WebServerInitializedEvent event) {
        int port = event.getWebServer().getPort();
        String address = "http://localhost:" + port;
        System.out.println("Application is running at: " + address);
    }

}

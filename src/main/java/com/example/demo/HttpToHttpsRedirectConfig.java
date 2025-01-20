package com.example.demo;

import org.apache.catalina.connector.Connector;
import org.springframework.boot.web.embedded.tomcat.TomcatServletWebServerFactory;
import org.springframework.boot.web.server.WebServerFactoryCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class HttpToHttpsRedirectConfig {
    //
//    @Bean
//    public TomcatServletWebServerFactory servletContainer() {
//        TomcatServletWebServerFactory tomcat = new TomcatServletWebServerFactory();
//        tomcat.addAdditionalTomcatConnectors(createHttpConnector());
//        return tomcat;
//    }
//
//    private Connector createHttpConnector() {
//        Connector connector = new Connector(TomcatServletWebServerFactory.DEFAULT_PROTOCOL);
//        connector.setPort(80); // HTTP-порт для перенаправления
//        connector.setScheme("http");
//        connector.setSecure(false);
//        connector.setRedirectPort(443); // Перенаправление на HTTPS-порт
//        return connector;
//    }
    @Bean
    public WebServerFactoryCustomizer<TomcatServletWebServerFactory> containerCustomizer() {
        System.out.println("араааоаоаооа");
        return factory -> {
            Connector connector = new Connector(TomcatServletWebServerFactory.DEFAULT_PROTOCOL);
            connector.setScheme("http");
            connector.setPort(80); // Порт HTTP
            connector.setSecure(false);
            connector.setRedirectPort(443); // Порт HTTPS
            factory.addAdditionalTomcatConnectors(connector);
        };
    }
}
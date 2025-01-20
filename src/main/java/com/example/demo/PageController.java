package com.example.demo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class PageController {

    // Метод для возврата основной страницы
    @GetMapping("/game")
    public String index() {
        return "index.html";
    }
    @GetMapping("/rps")
    public String rps() {
        return "rps.html";
    }
    @GetMapping("/tictactoe")
    public String tictactoe() {
        return "tictactoe.html";
    }
}
package com.example.demo;

import jakarta.annotation.PreDestroy;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import java.io.*;
import java.net.URISyntaxException;
import java.nio.file.*;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/stats")
public class GameController {

    private static String STATS_FILE;

    
    private Map<String, Map<String, Integer>> stats = new HashMap<>();

    public GameController() {
        try {
            
            File jarFile = new File(DemoApplication.class.getProtectionDomain().getCodeSource().getLocation().toURI());
            File jarDir = jarFile.getParentFile();
            File relativeFile = new File(jarDir, "data/example.txt"); 
            STATS_FILE = relativeFile.getAbsolutePath();
            System.out.println(STATS_FILE);
        } catch (URISyntaxException e) {
            System.out.println(e.getMessage());
        }

        loadStatsFromFile();
    }

    
    @PostMapping("/update")
    public ResponseEntity<?> updateStats(@RequestBody GameResult result) {
        String game = result.getGame();
        String outcome = result.getResult();

        
        stats.putIfAbsent(game, new HashMap<>());
        Map<String, Integer> gameStats = stats.get(game);
        gameStats.put(outcome, gameStats.getOrDefault(outcome, 0) + 1);

        
        saveStatsToFile();

        return ResponseEntity.ok(Map.of("message", "Статистика обновлена", "stats", stats));
    }

    
    @GetMapping
    public ResponseEntity<?> getStats() {
        loadStatsFromFile();
        return ResponseEntity.ok(stats);
    }

    
    private void loadStatsFromFile() {
        try {
            if (!Files.exists(Paths.get(STATS_FILE))) {
                return;
            }

            BufferedReader reader = new BufferedReader(new FileReader(STATS_FILE));
            String line;
            while ((line = reader.readLine()) != null) {
                String[] parts = line.split(":");
                if (parts.length == 3) {
                    String game = parts[0];
                    String outcome = parts[1];
                    int count = Integer.parseInt(parts[2]);

                    stats.putIfAbsent(game, new HashMap<>());
                    stats.get(game).put(outcome, count);
                }
            }
            reader.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    
    private void saveStatsToFile() {
        try {
            BufferedWriter writer = new BufferedWriter(new FileWriter(STATS_FILE));
            for (String game : stats.keySet()) {
                for (String outcome : stats.get(game).keySet()) {
                    int count = stats.get(game).get(outcome);
                    writer.write(game + ":" + outcome + ":" + count);
                    writer.newLine();
                }
            }
            writer.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
    @PreDestroy
    public void destroy() {
        System.out.println("приложение выключается");
    }
}
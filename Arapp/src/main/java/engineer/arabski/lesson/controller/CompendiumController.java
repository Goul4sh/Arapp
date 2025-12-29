package engineer.arabski.lesson.controller;

import engineer.arabski.lesson.dto.CompendiumListResponse;
import engineer.arabski.lesson.dto.CompendiumRequest;
import engineer.arabski.lesson.service.CompendiumService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/compendium")
public class CompendiumController {

//TODO testy!
private final CompendiumService compendiumService;

    public CompendiumController(CompendiumService compendiumService) {
        this.compendiumService = compendiumService;
    }

    @GetMapping
    public ResponseEntity<List<CompendiumListResponse>> getCompendiumList() {

        return ResponseEntity.status(HttpStatus.OK).body(compendiumService.getAllCompendiumListItems());

    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getCompendiumItemDetail(@PathVariable Long id) {

        return ResponseEntity.status(HttpStatus.OK).body(compendiumService.getCompendiumDetailById(id));
    }

    @PostMapping
    public ResponseEntity<?> createCompendiumItem(@RequestBody CompendiumRequest request) {

        System.out.println(request.toString());

        compendiumService.addCompendiumItem(request);
        return ResponseEntity.status(HttpStatus.CREATED).body("Compendium entry created successfully");
    }

}

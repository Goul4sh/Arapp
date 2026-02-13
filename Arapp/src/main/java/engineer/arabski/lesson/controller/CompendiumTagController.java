package engineer.arabski.lesson.controller;

import engineer.arabski.lesson.dto.CompendiumTagDTO;
import engineer.arabski.lesson.service.CompendiumTagService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/compendium/tags")
public class CompendiumTagController {


    private final CompendiumTagService compendiumTagService;

    public CompendiumTagController(CompendiumTagService compendiumTagService) {
        this.compendiumTagService = compendiumTagService;
    }

    @GetMapping
    public ResponseEntity<?> findAll() {

        return ResponseEntity.status(HttpStatus.OK).body(compendiumTagService.getAll());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> addTag(@RequestBody CompendiumTagDTO request) {
        compendiumTagService.addTag(request);
        return ResponseEntity.status(HttpStatus.OK).build();
    }


}

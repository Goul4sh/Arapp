package engineer.arabski.lesson.controller;

import engineer.arabski.lesson.dto.CompendiumListResponse;
import engineer.arabski.lesson.dto.CompendiumRequest;
import engineer.arabski.lesson.service.CompendiumService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/compendium")
public class CompendiumController {

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

    @GetMapping("/published")
    public ResponseEntity<?> findAllPublished() {

        return ResponseEntity.status(HttpStatus.OK).body(compendiumService.findAllPublished());

    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createCompendiumItem(@RequestBody CompendiumRequest request) {

        compendiumService.addCompendiumItem(request);
        return ResponseEntity.status(HttpStatus.CREATED).body("Compendium entry created successfully");
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteCompendiumItem(@PathVariable Long id) {
        compendiumService.deleteCompendiumItem(id);
        return ResponseEntity.status(HttpStatus.OK).body("Compendium entry deleted successfully");
    }

    @PatchMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> editCompendiumItem(@PathVariable Long id, @RequestBody CompendiumRequest request) {
        try {
            compendiumService.editCompendiumItem(id, request);
            return ResponseEntity.status(HttpStatus.OK).body("Compendium entry updated successfully");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Could not update entry");
        }
    }


    @PatchMapping("/{id}/publish/{isPublished}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> publishLesson(@PathVariable Long id, @PathVariable boolean isPublished) {
        try {
            compendiumService.publishEntry(id, isPublished);
            return ResponseEntity.status(HttpStatus.OK).body("Compendium entry published successfully");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Could not publish entry");
        }
    }

}

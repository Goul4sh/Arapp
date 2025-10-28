package engineer.arabski.task.model;

import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Map;

@Getter
@Setter
@Entity
@NoArgsConstructor
@Table(name = "match_pairs_task")
public class MatchPairsTask extends Task {

    @ElementCollection
    private Map<String, String> pairs;


}
package com.bourbon_nook.reviews_api.seed;

import com.bourbon_nook.reviews_api.entities.NoteCategoryEntity;
import com.bourbon_nook.reviews_api.entities.NoteEntity;
import com.bourbon_nook.reviews_api.repositories.NoteCategoryRepository;
import com.bourbon_nook.reviews_api.repositories.NoteRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Component
public class SystemNoteSeeder implements CommandLineRunner {
    private final NoteCategoryRepository noteCategoryRepository;
    private final NoteRepository noteRepository;

    private static final Map<String, List<String>> SYSTEM_NOTES = new LinkedHashMap<>();
    static {
        SYSTEM_NOTES.put("aged", List.of("leather", "tobacco", "varnish", "rancio", "molasses", "sweet oak", "tannin"));
        SYSTEM_NOTES.put("earthy", List.of("grass", "leaves", "cellar", "rickhouse", "barnyard", "rain", "cigar", "waxy", "vitamin", "iodine", "salinity"));
        SYSTEM_NOTES.put("finished", List.of("red wine", "white wine", "sauternes", "tokaji", "sherry", "port", "madeira", "marsala", "rum", "brandy", "tequila"));
        SYSTEM_NOTES.put("flawed", List.of("egg", "mold", "wet dog", "cheese", "vinegar", "bitter", "acrid", "astringent", "acetone", "permanent marker", "rubber"));
        SYSTEM_NOTES.put("floral", List.of("rose", "lavender", "wild flowers", "perfume", "potpourri"));
        SYSTEM_NOTES.put("fruity", List.of("lemon", "orange", "grapefruit", "lime", "cherry", "plum", "peach", "apricot", "apple", "pear", "fig", "grape", "banana", "coconut", "pineapple", "watermelon", "blackberry", "blueberry", "raspberry", "strawberry", "raisin", "date", "stewed"));
        SYSTEM_NOTES.put("grainy", List.of("corn", "rye", "wheat", "barley", "bread", "yeast", "ale", "pastry"));
        SYSTEM_NOTES.put("herbal", List.of("mint", "anise", "tea", "incense", "turpentine"));
        SYSTEM_NOTES.put("nutty", List.of("peanut", "almond", "hazelnut", "walnut", "pecan", "marzipan"));
        SYSTEM_NOTES.put("spicy", List.of("cinnamon", "clove", "nutmeg", "ginger", "cardamom", "caraway", "pepper", "allspice"));
        SYSTEM_NOTES.put("sweet", List.of("brown sugar", "confectioner sugar", "burnt sugar", "honey", "maple syrup", "caramel", "butterscotch", "toffee", "vanilla", "marshmallow", "bubblegum", "dark chocolate", "white chocolate", "milk chocolate", "fudge", "cola", "dr. pepper"));
        SYSTEM_NOTES.put("textural", List.of("rich", "viscous", "syrupy", "oily", "light", "watery", "delicate", "coating", "hot", "chewy"));
    }

    public SystemNoteSeeder(NoteCategoryRepository noteCategoryRepository, NoteRepository noteRepository) {
        this.noteCategoryRepository = noteCategoryRepository;
        this.noteRepository = noteRepository;
    }

    @Override
    public void run(String... args) {
        SYSTEM_NOTES.forEach((categoryName, noteNames) -> {
            NoteCategoryEntity category = noteCategoryRepository
                    .findByName(categoryName)
                    .orElseThrow(() -> new IllegalStateException(
                            "Expected category '" + categoryName + "' to already exist but it was not found"));

            for (String noteName : noteNames) {
                boolean alreadyExists = noteRepository
                        .findByCategoryAndNameAndCreatedBy(category, noteName, null)
                        .isPresent();

                if (!alreadyExists) {
                    noteRepository.save(NoteEntity.systemNote(category, noteName));
                }
            }
        });
    }
}

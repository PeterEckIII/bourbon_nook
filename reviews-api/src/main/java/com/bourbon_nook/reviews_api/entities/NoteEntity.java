package com.bourbon_nook.reviews_api.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.io.Serializable;

@Entity
@Table(name = "notes", uniqueConstraints = {
        @UniqueConstraint(name = "uq_note_per_scope", columnNames = {"name", "category_id", "created_by"})
})
public class NoteEntity implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "category_id", nullable = false)
    private NoteCategoryEntity category;

    @NotBlank
    @Column(nullable = false, length = 100)
    private String name;

    @Column(name = "is_system", nullable = false)
    private boolean system = false;

    @Column(name = "created_by")
    private String createdBy;

    protected NoteEntity() {}

    public static NoteEntity systemNote(NoteCategoryEntity category, String name) {
        NoteEntity note = new NoteEntity();
        note.category = category;
        note.name = name;
        note.system = true;
        return note;
    }

    public static NoteEntity userNote(NoteCategoryEntity category, String name, String userId) {
        NoteEntity note = new NoteEntity();
        note.category = category;
        note.name = name;
        note.system = false;
        note.createdBy = userId;
        return note;
    }

    public String getId() { return id; }
    public NoteCategoryEntity getCategory() { return category; }
    public void setCategory(NoteCategoryEntity category) { this.category = category; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public boolean isSystem() { return system; }
    public String getCreatedBy() { return createdBy; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if(!(o instanceof NoteEntity other)) return false;
        return id != null && id.equals(other.id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}

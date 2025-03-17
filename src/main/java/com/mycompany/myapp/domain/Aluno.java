package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;

/**
 * A Aluno.
 */
@Entity
@Table(name = "aluno")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Aluno implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "nome", nullable = false)
    private String nome;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "aluno")
    @JsonIgnoreProperties(value = { "aluno" }, allowSetters = true)
    private Set<Meta> metas = new HashSet<>();

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "aluno")
    @JsonIgnoreProperties(value = { "aluno" }, allowSetters = true)
    private Set<Total> totals = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Aluno id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return this.nome;
    }

    public Aluno nome(String nome) {
        this.setNome(nome);
        return this;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public Set<Meta> getMetas() {
        return this.metas;
    }

    public void setMetas(Set<Meta> metas) {
        if (this.metas != null) {
            this.metas.forEach(i -> i.setAluno(null));
        }
        if (metas != null) {
            metas.forEach(i -> i.setAluno(this));
        }
        this.metas = metas;
    }

    public Aluno metas(Set<Meta> metas) {
        this.setMetas(metas);
        return this;
    }

    public Aluno addMeta(Meta meta) {
        this.metas.add(meta);
        meta.setAluno(this);
        return this;
    }

    public Aluno removeMeta(Meta meta) {
        this.metas.remove(meta);
        meta.setAluno(null);
        return this;
    }

    public Set<Total> getTotals() {
        return this.totals;
    }

    public void setTotals(Set<Total> totals) {
        if (this.totals != null) {
            this.totals.forEach(i -> i.setAluno(null));
        }
        if (totals != null) {
            totals.forEach(i -> i.setAluno(this));
        }
        this.totals = totals;
    }

    public Aluno totals(Set<Total> totals) {
        this.setTotals(totals);
        return this;
    }

    public Aluno addTotal(Total total) {
        this.totals.add(total);
        total.setAluno(this);
        return this;
    }

    public Aluno removeTotal(Total total) {
        this.totals.remove(total);
        total.setAluno(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Aluno)) {
            return false;
        }
        return getId() != null && getId().equals(((Aluno) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Aluno{" +
            "id=" + getId() +
            ", nome='" + getNome() + "'" +
            "}";
    }
}

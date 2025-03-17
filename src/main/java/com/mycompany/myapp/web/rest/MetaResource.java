package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.Meta;
import com.mycompany.myapp.repository.MetaRepository;
import com.mycompany.myapp.web.rest.errors.BadRequestAlertException;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.mycompany.myapp.domain.Meta}.
 */
@RestController
@RequestMapping("/api/metas")
@Transactional
public class MetaResource {

    private static final Logger LOG = LoggerFactory.getLogger(MetaResource.class);

    private static final String ENTITY_NAME = "meta";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final MetaRepository metaRepository;

    public MetaResource(MetaRepository metaRepository) {
        this.metaRepository = metaRepository;
    }

    /**
     * {@code POST  /metas} : Create a new meta.
     *
     * @param meta the meta to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new meta, or with status {@code 400 (Bad Request)} if the meta has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<Meta> createMeta(@Valid @RequestBody Meta meta) throws URISyntaxException {
        LOG.debug("REST request to save Meta : {}", meta);
        if (meta.getId() != null) {
            throw new BadRequestAlertException("A new meta cannot already have an ID", ENTITY_NAME, "idexists");
        }
        meta = metaRepository.save(meta);
        return ResponseEntity.created(new URI("/api/metas/" + meta.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, meta.getId().toString()))
            .body(meta);
    }

    /**
     * {@code PUT  /metas/:id} : Updates an existing meta.
     *
     * @param id the id of the meta to save.
     * @param meta the meta to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated meta,
     * or with status {@code 400 (Bad Request)} if the meta is not valid,
     * or with status {@code 500 (Internal Server Error)} if the meta couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Meta> updateMeta(@PathVariable(value = "id", required = false) final Long id, @Valid @RequestBody Meta meta)
        throws URISyntaxException {
        LOG.debug("REST request to update Meta : {}, {}", id, meta);
        if (meta.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, meta.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!metaRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        meta = metaRepository.save(meta);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, meta.getId().toString()))
            .body(meta);
    }

    /**
     * {@code PATCH  /metas/:id} : Partial updates given fields of an existing meta, field will ignore if it is null
     *
     * @param id the id of the meta to save.
     * @param meta the meta to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated meta,
     * or with status {@code 400 (Bad Request)} if the meta is not valid,
     * or with status {@code 404 (Not Found)} if the meta is not found,
     * or with status {@code 500 (Internal Server Error)} if the meta couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Meta> partialUpdateMeta(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Meta meta
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update Meta partially : {}, {}", id, meta);
        if (meta.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, meta.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!metaRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Meta> result = metaRepository
            .findById(meta.getId())
            .map(existingMeta -> {
                if (meta.getValor() != null) {
                    existingMeta.setValor(meta.getValor());
                }
                if (meta.getArea() != null) {
                    existingMeta.setArea(meta.getArea());
                }

                return existingMeta;
            })
            .map(metaRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, meta.getId().toString())
        );
    }

    /**
     * {@code GET  /metas} : get all the metas.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of metas in body.
     */
    @GetMapping("")
    public List<Meta> getAllMetas() {
        LOG.debug("REST request to get all Metas");
        return metaRepository.findAll();
    }

    /**
     * {@code GET  /metas/:id} : get the "id" meta.
     *
     * @param id the id of the meta to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the meta, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Meta> getMeta(@PathVariable("id") Long id) {
        LOG.debug("REST request to get Meta : {}", id);
        Optional<Meta> meta = metaRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(meta);
    }

    /**
     * {@code DELETE  /metas/:id} : delete the "id" meta.
     *
     * @param id the id of the meta to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMeta(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete Meta : {}", id);
        metaRepository.deleteById(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}

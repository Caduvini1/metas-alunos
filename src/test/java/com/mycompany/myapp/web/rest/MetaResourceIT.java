package com.mycompany.myapp.web.rest;

import static com.mycompany.myapp.domain.MetaAsserts.*;
import static com.mycompany.myapp.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.Meta;
import com.mycompany.myapp.domain.enumeration.AreaDoEnem;
import com.mycompany.myapp.repository.MetaRepository;
import jakarta.persistence.EntityManager;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link MetaResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class MetaResourceIT {

    private static final Integer DEFAULT_VALOR = 1;
    private static final Integer UPDATED_VALOR = 2;

    private static final AreaDoEnem DEFAULT_AREA = AreaDoEnem.LINGUAGENS;
    private static final AreaDoEnem UPDATED_AREA = AreaDoEnem.CIENCIAS_HUMANAS;

    private static final String ENTITY_API_URL = "/api/metas";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private MetaRepository metaRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restMetaMockMvc;

    private Meta meta;

    private Meta insertedMeta;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Meta createEntity() {
        return new Meta().valor(DEFAULT_VALOR).area(DEFAULT_AREA);
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Meta createUpdatedEntity() {
        return new Meta().valor(UPDATED_VALOR).area(UPDATED_AREA);
    }

    @BeforeEach
    public void initTest() {
        meta = createEntity();
    }

    @AfterEach
    public void cleanup() {
        if (insertedMeta != null) {
            metaRepository.delete(insertedMeta);
            insertedMeta = null;
        }
    }

    @Test
    @Transactional
    void createMeta() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the Meta
        var returnedMeta = om.readValue(
            restMetaMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(meta)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            Meta.class
        );

        // Validate the Meta in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertMetaUpdatableFieldsEquals(returnedMeta, getPersistedMeta(returnedMeta));

        insertedMeta = returnedMeta;
    }

    @Test
    @Transactional
    void createMetaWithExistingId() throws Exception {
        // Create the Meta with an existing ID
        meta.setId(1L);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restMetaMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(meta)))
            .andExpect(status().isBadRequest());

        // Validate the Meta in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkValorIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        meta.setValor(null);

        // Create the Meta, which fails.

        restMetaMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(meta)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkAreaIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        meta.setArea(null);

        // Create the Meta, which fails.

        restMetaMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(meta)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllMetas() throws Exception {
        // Initialize the database
        insertedMeta = metaRepository.saveAndFlush(meta);

        // Get all the metaList
        restMetaMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(meta.getId().intValue())))
            .andExpect(jsonPath("$.[*].valor").value(hasItem(DEFAULT_VALOR)))
            .andExpect(jsonPath("$.[*].area").value(hasItem(DEFAULT_AREA.toString())));
    }

    @Test
    @Transactional
    void getMeta() throws Exception {
        // Initialize the database
        insertedMeta = metaRepository.saveAndFlush(meta);

        // Get the meta
        restMetaMockMvc
            .perform(get(ENTITY_API_URL_ID, meta.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(meta.getId().intValue()))
            .andExpect(jsonPath("$.valor").value(DEFAULT_VALOR))
            .andExpect(jsonPath("$.area").value(DEFAULT_AREA.toString()));
    }

    @Test
    @Transactional
    void getNonExistingMeta() throws Exception {
        // Get the meta
        restMetaMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingMeta() throws Exception {
        // Initialize the database
        insertedMeta = metaRepository.saveAndFlush(meta);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the meta
        Meta updatedMeta = metaRepository.findById(meta.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedMeta are not directly saved in db
        em.detach(updatedMeta);
        updatedMeta.valor(UPDATED_VALOR).area(UPDATED_AREA);

        restMetaMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedMeta.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(updatedMeta))
            )
            .andExpect(status().isOk());

        // Validate the Meta in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedMetaToMatchAllProperties(updatedMeta);
    }

    @Test
    @Transactional
    void putNonExistingMeta() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        meta.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restMetaMockMvc
            .perform(put(ENTITY_API_URL_ID, meta.getId()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(meta)))
            .andExpect(status().isBadRequest());

        // Validate the Meta in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchMeta() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        meta.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMetaMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(meta))
            )
            .andExpect(status().isBadRequest());

        // Validate the Meta in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamMeta() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        meta.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMetaMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(meta)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Meta in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateMetaWithPatch() throws Exception {
        // Initialize the database
        insertedMeta = metaRepository.saveAndFlush(meta);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the meta using partial update
        Meta partialUpdatedMeta = new Meta();
        partialUpdatedMeta.setId(meta.getId());

        partialUpdatedMeta.valor(UPDATED_VALOR).area(UPDATED_AREA);

        restMetaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedMeta.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedMeta))
            )
            .andExpect(status().isOk());

        // Validate the Meta in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertMetaUpdatableFieldsEquals(createUpdateProxyForBean(partialUpdatedMeta, meta), getPersistedMeta(meta));
    }

    @Test
    @Transactional
    void fullUpdateMetaWithPatch() throws Exception {
        // Initialize the database
        insertedMeta = metaRepository.saveAndFlush(meta);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the meta using partial update
        Meta partialUpdatedMeta = new Meta();
        partialUpdatedMeta.setId(meta.getId());

        partialUpdatedMeta.valor(UPDATED_VALOR).area(UPDATED_AREA);

        restMetaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedMeta.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedMeta))
            )
            .andExpect(status().isOk());

        // Validate the Meta in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertMetaUpdatableFieldsEquals(partialUpdatedMeta, getPersistedMeta(partialUpdatedMeta));
    }

    @Test
    @Transactional
    void patchNonExistingMeta() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        meta.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restMetaMockMvc
            .perform(patch(ENTITY_API_URL_ID, meta.getId()).contentType("application/merge-patch+json").content(om.writeValueAsBytes(meta)))
            .andExpect(status().isBadRequest());

        // Validate the Meta in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchMeta() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        meta.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMetaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(meta))
            )
            .andExpect(status().isBadRequest());

        // Validate the Meta in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamMeta() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        meta.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMetaMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(meta)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Meta in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteMeta() throws Exception {
        // Initialize the database
        insertedMeta = metaRepository.saveAndFlush(meta);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the meta
        restMetaMockMvc
            .perform(delete(ENTITY_API_URL_ID, meta.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return metaRepository.count();
    }

    protected void assertIncrementedRepositoryCount(long countBefore) {
        assertThat(countBefore + 1).isEqualTo(getRepositoryCount());
    }

    protected void assertDecrementedRepositoryCount(long countBefore) {
        assertThat(countBefore - 1).isEqualTo(getRepositoryCount());
    }

    protected void assertSameRepositoryCount(long countBefore) {
        assertThat(countBefore).isEqualTo(getRepositoryCount());
    }

    protected Meta getPersistedMeta(Meta meta) {
        return metaRepository.findById(meta.getId()).orElseThrow();
    }

    protected void assertPersistedMetaToMatchAllProperties(Meta expectedMeta) {
        assertMetaAllPropertiesEquals(expectedMeta, getPersistedMeta(expectedMeta));
    }

    protected void assertPersistedMetaToMatchUpdatableProperties(Meta expectedMeta) {
        assertMetaAllUpdatablePropertiesEquals(expectedMeta, getPersistedMeta(expectedMeta));
    }
}

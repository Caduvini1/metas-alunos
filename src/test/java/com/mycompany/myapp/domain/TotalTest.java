package com.mycompany.myapp.domain;

import static com.mycompany.myapp.domain.AlunoTestSamples.*;
import static com.mycompany.myapp.domain.TotalTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class TotalTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Total.class);
        Total total1 = getTotalSample1();
        Total total2 = new Total();
        assertThat(total1).isNotEqualTo(total2);

        total2.setId(total1.getId());
        assertThat(total1).isEqualTo(total2);

        total2 = getTotalSample2();
        assertThat(total1).isNotEqualTo(total2);
    }

    @Test
    void alunoTest() {
        Total total = getTotalRandomSampleGenerator();
        Aluno alunoBack = getAlunoRandomSampleGenerator();

        total.setAluno(alunoBack);
        assertThat(total.getAluno()).isEqualTo(alunoBack);

        total.aluno(null);
        assertThat(total.getAluno()).isNull();
    }
}

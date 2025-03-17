package com.mycompany.myapp.domain;

import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;

public class TotalTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static Total getTotalSample1() {
        return new Total().id(1L);
    }

    public static Total getTotalSample2() {
        return new Total().id(2L);
    }

    public static Total getTotalRandomSampleGenerator() {
        return new Total().id(longCount.incrementAndGet());
    }
}

package com.mycompany.myapp.domain;

import java.util.Random;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;

public class MetaTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));
    private static final AtomicInteger intCount = new AtomicInteger(random.nextInt() + (2 * Short.MAX_VALUE));

    public static Meta getMetaSample1() {
        return new Meta().id(1L).valor(1);
    }

    public static Meta getMetaSample2() {
        return new Meta().id(2L).valor(2);
    }

    public static Meta getMetaRandomSampleGenerator() {
        return new Meta().id(longCount.incrementAndGet()).valor(intCount.incrementAndGet());
    }
}

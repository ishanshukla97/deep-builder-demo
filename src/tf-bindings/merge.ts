import * as tf from "@tensorflow/tfjs";

export const mappings = {
    add: tf.layers.add,
    average: tf.layers.average,
    concatenate: tf.layers.concatenate,
};

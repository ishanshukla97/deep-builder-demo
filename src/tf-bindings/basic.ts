import * as tf from "@tensorflow/tfjs";

export const mappings = {
    dense: tf.layers.dense,
    dropout: tf.layers.dropout,
    flatten: tf.layers.flatten,
    reshape: tf.layers.reshape,
    input: tf.input
};

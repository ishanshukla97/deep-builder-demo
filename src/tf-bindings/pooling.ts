import * as tf from "@tensorflow/tfjs";

export const mappings = {
    averagePooling2d: tf.layers.averagePooling2d,
    globalAveragePooling2d: tf.layers.globalAveragePooling2d,
    globalMaxPooling2d: tf.layers.globalMaxPool2d,
    maxPooling2d: tf.layers.maxPool2d
};

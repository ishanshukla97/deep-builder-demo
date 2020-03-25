import * as tf from "@tensorflow/tfjs";

export const mappings = {
    conv1d: tf.layers.conv1d,
    conv2d: tf.layers.conv2d,
    separableConv2d: tf.layers.separableConv2d,
    upSampling2d: tf.layers.upSampling2d
};

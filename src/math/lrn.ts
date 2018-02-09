/**
 * @license
 * Copyright 2018 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */

import {ENV} from '../environment';
import * as util from '../util';

import {doc, operation} from './decorators';
import {Tensor, Tensor3D, Tensor4D} from './tensor';

export class LRN {
  /**
   * Normalizes the activation of a local neighborhood across or within
   * channels.
   * @param x The input Tensor. The 4-D input tensor is treated as a 3-D array
   *     of 1D vectors (along the last dimension), and each vector is
   * normalized independently.
   * @param radius The number of adjacent channels or spatial locations of the
   *     1D normalization window. In Tensorflow this param is called
   *     'depth_radius' because only 'acrossChannels' mode is supported.
   * @param bias A constant bias term for the basis.
   * @param alpha A scale factor, usually positive.
   * @param beta An exponent.
   * @param normRegion A string from: ['acrossChannels', 'withinChannel'].
   *     Default is 'acrossChannels'.
   */
  @doc({heading: 'Normalization', subheading: 'Slicing and Joining'})
  @operation
  static localResponseNormalization<T extends Tensor>(
      x: T, radius = 5, bias = 1, alpha = 1, beta = 0.5,
      normRegion: 'acrossChannels'|'withinChannel' = 'acrossChannels'): T {
    if (x.rank === 3) {
      return localResponseNormalization3D(
          x, radius, bias, alpha, beta, normRegion);
    } else if (x.rank === 4) {
      return Ops.reverse4d(x as Tensor4D, axis) as Tensor<R>;
    } else {
      throw new Error(`Reverse for rank ${x.rank} is not yet implemented`);
    }
  }
}

function localResponseNormalization3D(
    x: Tensor3D, radius = 5, bias = 1, alpha = 1, beta = 0.5,
    normRegion: 'acrossChannels'|'withinChannel' = 'acrossChannels'): Tensor3D {
  util.assert(
      x.rank === 3,
      `Error in localResponseNormalization3D: x must be rank 3 but got
   rank ${x.rank}.`);
  util.assert(
      util.isInt(radius),
      `Error in localResponseNormalization3D: radius must be an integer
   but got radius ${radius}.`);

  const input4D = x.as4D(1, x.shape[0], x.shape[1], x.shape[2]);
  const res = localResponseNormalization4D(
      input4D, radius, bias, alpha, beta, normRegion);
  return res.as3D(res.shape[1], res.shape[2], res.shape[3]);
}

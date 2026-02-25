class ResamplePCMProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.inSr = sampleRate;
    this.outSr = 24000;
    this.ratio = this.inSr / this.outSr;
    this.phase = 0;
    this.hold = [];
  }

  _resampleBlock(input) {
    const out = [];
    for (let i = 0; ; i++) {
      const t = this.phase + i * this.ratio;
      const idx = Math.floor(t);
      const frac = t - idx;
      if (idx + 1 >= input.length) break;
      const s = input[idx] * (1 - frac) + input[idx + 1] * frac;
      out.push(s);
    }
    this.phase = (this.phase + input.length) % this.ratio;
    return out;
  }

  _flushFrames() {
    const frameSize = 240;
    while (this.hold.length >= frameSize) {
      const frame = this.hold.slice(0, frameSize);
      this.hold = this.hold.slice(frameSize);

      const buffer = new ArrayBuffer(frame.length * 2);
      const view = new DataView(buffer);
      for (let i = 0; i < frame.length; i++) {
        let s = frame[i];
        if (s > 1) s = 1;
        if (s < -1) s = -1;
        view.setInt16(i * 2, s < 0 ? s * 0x8000 : s * 0x7fff, true);
      }

      this.port.postMessage(buffer, [buffer]);
    }
  }

  process(inputs) {
    const ch0 = inputs[0][0];
    if (!ch0) return true;

    let mean = 0;
    for (let i = 0; i < ch0.length; i++) mean += ch0[i];
    mean /= ch0.length;
    for (let i = 0; i < ch0.length; i++) ch0[i] -= mean;

    const out = this._resampleBlock(ch0);
    if (out.length) {
      this.hold.push(...out);
      this._flushFrames();
    }
    return true;
  }
}

registerProcessor("resample-pcm-processor", ResamplePCMProcessor);

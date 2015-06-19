
module Yescrypt

  def calculate(password, salt, n, r, p, t, g, flags, dkLen)

  end

  def fNloop(n, t, flags)

  end

  def p2floor(x)

  end

  def wrap(x, i)

  end

  def sMix(n, r, t, p, pbkdf2_blocks, flags)

  end

  def sMix1(r, input_block, n, out_seq_write_memory, flags, sbox)

  end

  def sMix2(r, input_block, n, nloop, seq_write_memory, flags, sbox)

  end

  def blockmix_pwxform(r, b, sbox)

  end

  def pwxform(b, sbox)

  end

  def Yescrypt.simd_shuffle_block(x)
    tmp = Array.new(16)
    0.upto(15) do |i|
      tmp[i] = x[i * 5 % 16]
    end
    0.upto(15) do |i|
      x[i] = tmp[i]
    end
  end

  def Yescrypt.simd_unshuffle_block(x)
    tmp = Array.new(16)
    0.upto(15) do |i|
      tmp[i * 5 % 16] = x[i]
    end
    0.upto(15) do |i|
      x[i] = tmp[i]
    end
  end

  def simd_shuffle(b)

  end

  def simd_unshuffle(b)

  end

  def integerify(r, b)

  end

  def blockmix_salsa8(r, b)

  end

  def Yescrypt.salsa20_core_ints(x)
    self.simd_unshuffle_block(x)

    copy = x.dup

    8.step(1, -2) do |i|
          x[ 4] ^= self.rot((x[ 0]+x[12]) & 0xffffffff, 7);  x[ 8] ^= self.rot((x[ 4]+x[ 0]) & 0xffffffff, 9);
          x[12] ^= self.rot((x[ 8]+x[ 4]) & 0xffffffff,13);  x[ 0] ^= self.rot((x[12]+x[ 8]) & 0xffffffff,18);
          x[ 9] ^= self.rot((x[ 5]+x[ 1]) & 0xffffffff, 7);  x[13] ^= self.rot((x[ 9]+x[ 5]) & 0xffffffff, 9);
          x[ 1] ^= self.rot((x[13]+x[ 9]) & 0xffffffff,13);  x[ 5] ^= self.rot((x[ 1]+x[13]) & 0xffffffff,18);
          x[14] ^= self.rot((x[10]+x[ 6]) & 0xffffffff, 7);  x[ 2] ^= self.rot((x[14]+x[10]) & 0xffffffff, 9);
          x[ 6] ^= self.rot((x[ 2]+x[14]) & 0xffffffff,13);  x[10] ^= self.rot((x[ 6]+x[ 2]) & 0xffffffff,18);
          x[ 3] ^= self.rot((x[15]+x[11]) & 0xffffffff, 7);  x[ 7] ^= self.rot((x[ 3]+x[15]) & 0xffffffff, 9);
          x[11] ^= self.rot((x[ 7]+x[ 3]) & 0xffffffff,13);  x[15] ^= self.rot((x[11]+x[ 7]) & 0xffffffff,18);
          x[ 1] ^= self.rot((x[ 0]+x[ 3]) & 0xffffffff, 7);  x[ 2] ^= self.rot((x[ 1]+x[ 0]) & 0xffffffff, 9);
          x[ 3] ^= self.rot((x[ 2]+x[ 1]) & 0xffffffff,13);  x[ 0] ^= self.rot((x[ 3]+x[ 2]) & 0xffffffff,18);
          x[ 6] ^= self.rot((x[ 5]+x[ 4]) & 0xffffffff, 7);  x[ 7] ^= self.rot((x[ 6]+x[ 5]) & 0xffffffff, 9);
          x[ 4] ^= self.rot((x[ 7]+x[ 6]) & 0xffffffff,13);  x[ 5] ^= self.rot((x[ 4]+x[ 7]) & 0xffffffff,18);
          x[11] ^= self.rot((x[10]+x[ 9]) & 0xffffffff, 7);  x[ 8] ^= self.rot((x[11]+x[10]) & 0xffffffff, 9);
          x[ 9] ^= self.rot((x[ 8]+x[11]) & 0xffffffff,13);  x[10] ^= self.rot((x[ 9]+x[ 8]) & 0xffffffff,18);
          x[12] ^= self.rot((x[15]+x[14]) & 0xffffffff, 7);  x[13] ^= self.rot((x[12]+x[15]) & 0xffffffff, 9);
          x[14] ^= self.rot((x[13]+x[12]) & 0xffffffff,13);  x[15] ^= self.rot((x[14]+x[13]) & 0xffffffff,18);
    end

    0.upto(15) do |i|
      x[i] = (copy[i] + x[i]) & 0xffffffff
    end

    self.simd_shuffle_block(x)
  end

  def Yescrypt.rot(int, rot)
    ((int << rot) | ((int >> (32 - rot)) & ((1 << rot) - 1))) & 0xffffffff
  end

end

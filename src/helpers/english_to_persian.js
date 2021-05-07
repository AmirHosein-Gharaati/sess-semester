function toFarsiNumber(n) {
    const farsiDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

    return n
      .toString()
      .split('')
      .map(x => {
        if (x >= '0' && x <= '9')
          return farsiDigits[x];
        else
          return x;
      })
      .join('');
  }

export {toFarsiNumber};
import * as React from 'react';

const useWindowBottom = () => {
  const [isBottom, setIsBottom] = React.useState(false);

  const handleScroll = () => {
    const windowHeight = window.innerHeight;
    const bodyHeight = document.body.offsetHeight;
    const scrollTop = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop;
    setIsBottom((scrollTop + windowHeight) >= (bodyHeight - 5));
  };

  React.useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return [isBottom];
}

export default useWindowBottom;

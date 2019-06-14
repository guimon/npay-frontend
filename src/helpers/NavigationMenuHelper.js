export const NavigationMenuHelper = {
  isSamePath,
  getLinkColor
};

export default NavigationMenuHelper;

function isSamePath(path, history) {
  return history.location.pathname === path;
}

function getLinkColor(path, history) {
  if (isSamePath(path, history)) {
    return 'primary';
  } else {
    return 'default';
  }
}
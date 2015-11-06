export default function layout({ urls }) {
  return {
    homeUrl: urls.home.index(),
    tutorialUrl: urls.home.tutorial(),
  };
}

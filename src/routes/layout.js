export default function layout({ urls, session: { login } = {} }) {
  return {
    homeUrl: urls.home.index(),
    tutorialUrl: urls.home.tutorial(),
    repoUrl: login ? urls.repo.index(login) : null,
  };
}

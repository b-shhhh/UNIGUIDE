const push = jest.fn();
const replace = jest.fn();
const prefetch = jest.fn();
const back = jest.fn();

export const useRouter = () => ({ push, replace, prefetch, back });
export const usePathname = () => "/";

const searchParams = new URLSearchParams();
export const useSearchParams = () => searchParams;

export const __resetNavigationMocks = () => {
  push.mockClear();
  replace.mockClear();
  prefetch.mockClear();
  back.mockClear();
  Array.from(searchParams.keys()).forEach((key) => searchParams.delete(key));
};

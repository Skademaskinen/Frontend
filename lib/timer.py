from time import perf_counter
def timer(func):
    _pre = perf_counter()
    result = func()
    _post = perf_counter()
    return result, _post - _pre


if __name__ == "__main__":
    @timer
    def test_func(string:str = "Hello World") -> str:
        print(string)
        return string
    
    res = test_func()
    print(res[0])


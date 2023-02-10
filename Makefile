CC=clang++
target=chess
objects=main.o function.o

$(target): $(objects)
	$(CC) -o $(target) $(objects) -lm

$(objects) : header.h

.PHONY : clean
clean:
	rm $(target) $(objects)

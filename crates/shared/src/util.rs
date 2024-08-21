use std::mem;

pub fn is_empty<T>(_: &T) -> bool {
    mem::size_of::<T>() == 0
}

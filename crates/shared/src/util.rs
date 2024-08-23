use std::mem;

pub fn is_empty<T>(_: &T) -> bool {
    mem::size_of::<T>() == 0
}

pub fn like_pattern(key: &Option<String>) -> Option<String> {
    match key {
        Some(k) => Some(format!("%{}%", k)),
        None => None,
    }
}

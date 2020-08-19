function mapToDatabaseReadable(obj) {
  return {
    id: obj.value,
    name: obj.label
  }
}

export { mapToDatabaseReadable, getAllInterns };
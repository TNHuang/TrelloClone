json.array! @cards do |card|
  json.extract! card, :id, :title, :description, :created_at, :updated_at
end

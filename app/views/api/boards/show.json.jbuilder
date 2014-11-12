# write some jbuilder to return some json about a board
# it should include the board
#  - its lists
#    - the cards for each list
json.extract! @board, :id, :title, :created_at, :updated_at

json.lists @board.lists do |list|
  json.extract! list, :id, :title, :ord, :created_at, :updated_at
   json.cards list.cards do |card|
     json.extract! card, :id, :list_id, :title, :description, :ord, :created_at, :updated_at
   end
end

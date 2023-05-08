class SpacesUser < ApplicationRecord
  belongs_to :user
  belongs_to :space
  validates_uniqueness_of :user_id, scope: :space_id
end

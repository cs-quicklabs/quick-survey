class Folder < ActiveRecord::Base
  acts_as_tenant :account
  belongs_to :space
  belongs_to :user
  has_rich_text :body
  validates_presence_of :body, :title
  has_many :message_comments, dependent: :destroy
  scope :published, -> { where(published: true) }
  scope :draft, -> { where(published: false) }
end

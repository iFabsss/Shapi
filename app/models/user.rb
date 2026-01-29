class User < ApplicationRecord
  has_secure_password
  has_many :sessions, dependent: :destroy

  normalizes :email_address, with: ->(e) { e.strip.downcase }
  validates_uniqueness_of :username, :email_address
  validates_presence_of :username, :email_address, :password_digest, :password_confirmation
end

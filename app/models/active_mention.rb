class ActiveMention < ApplicationRecord
  validates :name, presence: true
  validates :position, uniqueness: { scope: :is_active }, allow_nil: true

  scope :active, -> { where(is_active: true).order(:position) }
  scope :inactive, -> { where(is_active: false) }

  # Métodos para gestión de posiciones
  def activate!(new_position)
    update!(is_active: true, position: new_position)
  end

  def deactivate!
    update!(is_active: false, position: nil)
  end

  # Reordenar posiciones
  def self.reorder_positions(mention_ids)
    mention_ids.each_with_index do |mention_id, index|
      find(mention_id).update!(position: index + 1)
    end
  end
end 
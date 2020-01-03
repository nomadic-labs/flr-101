import React from "react";
import Slider from "react-slick";
import Button from "@material-ui/core/Button"
import Grid from "@material-ui/core/Grid"

import Reading from "./Reading"


class Readings extends React.Component {
  onSaveItem = itemId => itemContent => {
    const newContent = {
      ...this.props.content,
      [itemId]: itemContent
    }

    this.props.onSave(newContent)
  }

  onDeleteItem = itemId => () => {
    let newContent = { ...this.props.content }
    delete newContent[itemId];

    if (Object.keys(newContent).length === 0) {
      this.props.onDelete()
    } else {
      this.props.onSave(newContent)
    }
  }

  onAddItem = () => {
    let newContent = { ...this.props.content }
    const newItemKey = `reading-${Date.now()}`
    newContent[newItemKey] = {
      "reading-item-details": { "text": "Author, date" },
      "reading-item-title": { "text": "Publication title" },
      "reading-item-description": { "text": "Summary" },
      "reading-item-link": { "anchor": "link text", "link": "/" }
    }

    this.props.onSave(newContent)
  }

  render() {
    const itemsKeys = Object.keys(this.props.content);

    return (
      <div className={`collection ${this.props.classes}`}>
        <Grid container spacing={2}>
        {itemsKeys.map((key,index) => {
          const content = this.props.content[key];
          return(
            <Grid item xs={12} sm={6} md={4}>
              <Reading
                key={`readings-item-${key}`}
                index={index}
                content={content}
                onSave={this.onSaveItem(key)}
                onDelete={this.onDeleteItem(key)}
              />
            </Grid>
          )
        })}
        {
          this.props.isEditingPage &&
          <div className="row mt-4">
            <div className="col-12">
              <Button onClick={this.onAddItem}>Add item</Button>
            </div>
          </div>
        }
        </Grid>
      </div>
    );
  }
}

export default Readings
